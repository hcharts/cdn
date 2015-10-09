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
      return;
    }
  }
  echo "failure";
?>