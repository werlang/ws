<?php
    function soap_curl() {
        $curl = curl_init();
    
        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
                <ubiNum>584</ubiNum>
            </NumberToWords>
            </soap:Body>
        </soap:Envelope>',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: text/xml; charset=utf-8'
            ),
        ));
    
        $response = curl_exec($curl);
    
        curl_close($curl);
        echo $response;
    }

    function soap_client() {
        $client = new SoapClient('https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL');
        $function = 'NumberToWords';
        $arguments= [ $function => ['ubiNum' => 500] ];
        $options = [ 'location' => 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso' ];
    
        $result = $client->__soapCall($function, $arguments, $options);
    
        echo 'Response: <pre>';
        var_dump($result);
        echo '</pre>';
    
        echo '<br><br>Response: '.$result->NumberToWordsResult;
    }

    // soap_curl();
    soap_client();

?>
