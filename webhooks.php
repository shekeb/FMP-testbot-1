<?php

//echo "BASEPATH: " . BASEPATH ."<br/>";
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Webhooks extends CI_Controller {
  
  function index()
  {
  }
  
  // Test
  function hello()
  {
    echo "world";
  }
  
  // Playing around with $_GET, call with e.g. localhost:8888/webhooks/test?a=haha
  function test()
  {
    echo "<br/>get<br/>";
    print_r($_GET);
    echo "<br/>request<br/>";
    print_r($_REQUEST);
    echo "<br/>post<br/>";
    print_r($_POST);
    echo "<br/><br/>";
    if($_GET["a"] === "") echo "a is an empty string<br/>";
    if($_GET["a"] === false) echo "a is false<br/>";
    if($_GET["a"] === null) echo "a is null<br/>";
    if(isset($_GET["a"])) echo "a is set<br/>";
    if(!empty($_GET["a"])) echo "a is not empty";
  }
  
  
  // Responding to the facebook messenger request
  function webhook()
  {
    // declare some varibales that we'll need - copy values over from the facebook messenger app settings page
    $mypagetoken = "CAAIempLSlQUBAF5yevlajFSlZBMInsUahJLpX04KBCAv5RWj3faxVkLrdzTTQw9BPIuPUbnoyneBFcomPlngIhgRZABHoSxKZBhX7EVVAWwoc4GYZCnONZA8hmTCqblpFfMc3xdYZCewtLhX5uT9GiHjfKrrNdiknyZBnZClsvg7ZAUPE9JaGBTZBnrI6w0yWGywwZD";
    $mywebhooktoken = "uYqoaKfoI9G1MtYg36vJJQigqFr7tJ0FA1NFjb6mtZDqwMVZ7BtcP3szWsXPBqXNsjiSuC4t5Z8AIWKzeG5V0INKPIovYG52VGGlFUteAucRjf03jzJ8Oi7fqKjxu38uhAbCpRUuneeYTYfGNhv5zgZamnL8L6x3iI6WT9yaqVnjTq2NHDxxxU8GmUn0SQ44OeMcWdE1";
    
    // pull some values from the facebook messenger app request
    $challenge = $_POST['hub_challenge'];
    $verify_token = $_GET['hub_verify_token'];
    
    // verify the validation token
    if ($verify_token === $mywebhooktoken) {
      echo $challenge;
    } else {
      echo("Error, wrong validation token");
    }
        
    $input = json_decode(file_get_contents('php://input'), true);
    
    // user's id who sent the message
    $sender = $input['entry'][0]['messaging'][0]['sender']['id'];
    // user's message
    $message = $input['entry'][0]['messaging'][0]['message']['text'];
    
    // prepare reply to the message
    if ($message) {
      $jsonData = '{
        "recipient":{"id":"'.$sender.'"},
        "message":{"text":"Text received was: '.$message.'"}
      }';
    } else {
      echo "no message";
    }
    
    // return address where the message should be sent
    $url = 'https://graph.facebook.com/v2.6/me/messages?access_token='.$mypagetoken;
    
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
    //echo "<br/>hello hello<br/>";
    //echo $ch;
    
    if (!empty($input['entry'][0]['messaging'][0]['message'])) {
      $result = curl_exec($ch);
    }
  }


}

?>