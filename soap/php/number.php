<?php
    if (!isset($_GET["number"])) {
        echo json_encode(["error" => "Must provide a number"]);
        exit;
    }

    $number = $_GET["number"];

    $client = new SoapClient('https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL');
    $function = 'NumberToWords';
    $arguments= [ $function => ['ubiNum' => $number] ];
    $options = [ 'location' => 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso' ];

    $result = $client->__soapCall($function, $arguments, $options);

    echo json_encode([ "result" => $result ]);
?>
