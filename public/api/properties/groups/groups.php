<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $data = $DB->query("SELECT pg.id,pg.title,pg.description,pg.address,pg.active,pg.type,gtp.label As type_label,(SELECT COUNT(p.id) FROM properties AS p WHERE p.group = pg.id) as properties FROM properties_groups AS pg LEFT JOIN groups_types AS gtp ON gtp.id = pg.type");
    if ($data->num_rows > 0) {
        $rows=[];
        while($row=$data->fetch_object()) {
            $row->type = ['id'=>$row->type, 'label'=>$row->type_label];
            unset($row->type_label);
            array_push($rows,$row);
        }
        throwSuccess($rows);
    } else {
        throwError(203, "No se encontraron grupos de propiedades.");
    }
}
?>