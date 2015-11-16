<?php
  if(isset($_POST['action'])) {
    $action = $_POST['action'];

    // 检查更新
    if($action === 'checkupdate') {
      $name = $_POST['name'];
      $version = $_POST['version'];
      echo $name.$version;
      return;
    }

    // 安装
    if($action === 'install') {
      $name = $_POST['name'];

      return;
    }

    // 搜索
    if($action === 'search') {
      $name = $_POST['name'];
      exec('bower search '.$name, $res, $status);
      $length=count($res);
      // for($i=0;$i<$length;$i++) {
        // echo $res[$i];
      // }

      // var_dump($res);
      echo json_encode($res);
      return ;
    }
  }
  echo "failure";
?>