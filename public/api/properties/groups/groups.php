<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_groups = $DB->query("SELECT pg.id,pg.title,pg.description,pg.address,pg.active,(SELECT COUNT(p.id) FROM properties AS p WHERE p.group = pg.id) as properties FROM properties_groups AS pg");
    if ($properties_groups->num_rows > 0) {
        echo json_encode(getRowsArray($properties_groups), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No groups found");
    }
}
?>