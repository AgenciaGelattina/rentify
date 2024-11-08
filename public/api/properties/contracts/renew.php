<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../database.php';

if (METHOD === 'GET') {
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));
    $property = intval($DB->real_escape_string($_GET['property_id']));

    //CHECK IF CONTRACT EXIST
    $query_check_contract = "SELECT id,property,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts WHERE property = $property AND canceled = 0 AND finalized = 0 AND end_date >= CURDATE()";
    $contract_check_result = $DB->query($query_check_contract);
    
    if ($contract_check_result->num_rows === 0) {
    
        $query_contract = "SELECT property,currency,due_date FROM property_contracts WHERE id = $contract_id";
        $contract_result = $DB->query($query_contract);

        if ($contract_result->num_rows > 0) {
            $row = $contract_result->fetch_object();

            // CONTRACT
            $contract = new stdClass();
            $contract->property = $row->property;
            $contract->currency = $row->currency;
            $contract->due_date = $row->due_date;

            //CONTRACTORS
            $contract->contractors = [];
            $query = "SELECT names,surnames,email,phone FROM contracts_contractors WHERE contract = $contract_id";
            $contractors_result = $DB->query($query);
            if ($contractors_result->num_rows > 0) {
                while($contractor = $contractors_result->fetch_object()) {
                    $contractor->selected = true;
                    array_push($contract->contractors, $contractor);
                };
            }
            
            //FOLDERS
            $contract->folders = [];
            $query = "SELECT cf.name,cf.title,cf.description,(SELECT COUNT(fl.id) FROM contracts_folders_files AS fl WHERE fl.folder = cf.name) AS files FROM contracts_folders AS cf WHERE cf.contract = $contract_id";
            $folders_result = $DB->query($query);
            if ($folders_result->num_rows > 0) {
                while($folder = $folders_result->fetch_object()) {
                    $folder->selected = true;
                    array_push($contract->folders, $folder);
                };
            }

            throwSuccess($contract);
        } else {
            throwError(203, "No se pudo renovar el contrato");
        }
    } else {
        throwError(203, "No se puede renovar el contrato porque existe ya un contrato activo.");
    }
    $DB->close();
}

if (METHOD === 'POST') {
    $property = intval($DB->real_escape_string(POST['property']));
    $value = $DB->real_escape_string(POST['value']);
    $currency = $DB->real_escape_string(POST['currency']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);
    $in_date = $DB->real_escape_string(POST['in_date']);
    $out_date = $DB->real_escape_string(POST['out_date']);
    
    $query_contract_insert ="INSERT INTO property_contracts (`property`,`currency`,`due_date`,`start_date`,`end_date`,`in_date`,`out_date`) VALUES ($property,'$currency',$due_date,'$start_date','$end_date','$in_date','$out_date')";
    $DB->query($query_contract_insert);
    
    $newID = $DB->insert_id;
    if ($newID > 0) {

        //RECURRING PAYMENT
        $query_payment_insert ="INSERT INTO contracts_recurring_payments (contract,label,value,start_date,end_date) VALUES ($newID,'Renta','$value','$start_date','$end_date')";
        $DB->query($query_payment_insert);
        

        // FILES
        $query_folders_insert = "INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ";
        $query_folders_values = [];
        foreach(POST['folders'] as $key => $value) {
            $folder = new stdClass();
            $folder->name = $value['name'];
            $folder->title = $value['title'];
            $folder->description = $value['description'];
            
            $folderToCreate = FOLDERSPATH."/".$folder->name;
            if (!file_exists($folderToCreate)) {
                mkdir($folderToCreate, 0777, true);
            };
            
            array_push($query_folders_values, "('$folder->name',$newID,'$folder->title','$folder->description',CURDATE())");
        }
        $query_folders_insert .= implode(",", $query_folders_values);
        $DB->query($query_folders_insert);
    
        $query_files_insert = "INSERT INTO contracts_folders_files (`id`,`folder`,`name`,`type`,`size`) VALUES ";
        $query_files_values = [];
        foreach(POST['folders'] as $key => $value) {
            $folder = new stdClass();
            $folder->from_path = FOLDERSPATH."/".$value['copy_from'];
            $folder->oldName = $value['copy_from'];
            $folder->newName = $value['name'];
            $folder->filesNewName = $value['files_name'];
            $folder->to_path = FOLDERSPATH."/".$value['name'];

            $query_files = "SELECT id,folder,name,type,size FROM contracts_folders_files where folder = '$folder->oldName'";
            $files_result = $DB->query($query_files);
            if ($files_result->num_rows > 0) {
                $NIndex = 0;
                while($file = $files_result->fetch_object()) {
                    $fileToCopy = new stdClass();
                    $fileToCopy->from = $folder->from_path."/".$file->id.".".$file->type;
                    $fileToCopy->to = $folder->to_path."/".$file->id.".".$file->type;
                    $fileToCopy->copied = copy($fileToCopy->from , $fileToCopy->to);
                    $fileToCopy->newID = $folder->filesNewName[$NIndex];
                    if ($fileToCopy->copied) {
                        array_push($query_files_values,"('$fileToCopy->newID','$folder->newName','$file->name','$file->type',$file->size)");
                        $NIndex++;
                    }
                };
            }
        }
        $query_files_insert .= implode(",", $query_files_values);
        $DB->query($query_files_insert);
        
        //CONTRACTORS
        $query_contractors ="INSERT INTO contracts_contractors (`contract`,`names`,`surnames`,`email`,`phone`) VALUES ";
        $query_contractors_values = [];
        foreach(POST['contractors'] as $key => $value) {
            $contractor = new stdClass();
            $contractor->names = $value['names'];
            $contractor->surnames = $value['surnames'];
            $contractor->email = $value['email'];
            $contractor->phone = $value['phone'];
            array_push($query_contractors_values, "($newID,'$contractor->names','$contractor->surnames','$contractor->email','$contractor->phone')");
        };
        $query_contractors .= implode(",", $query_contractors_values);
        $DB->query($query_contractors);

        throwSuccess(true,"El contrato fue renovado.");
    } else {
        throwError(203, "No se pudo renovar el contrato");
    }
    $DB->close();
}
?>