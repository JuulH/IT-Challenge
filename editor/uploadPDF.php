<?php
    // if (isset($_POST['pdf']) && isset($_POST['fileName'])){
        // $PDFname = $_POST['fileName'];
        // echo json_encode($PDFname);
        $PDFname = "test.pdf";
        // $data = file_get_contents($_FILES['pdf']['tmp_name']);
        $data = $_POST['pdf'];

        $parent_dir = dirname(__DIR__, 1);
        // $target_dir = "$parent_dir/media/user-designs/"; // Directory where the pdf will be uploaded
        // $target_file = $target_dir . $PDFname;
        
        file_put_contents("$parent_dir/media/user-designs/$PDFname", $data);
        // $file = fopen("$parent_dir/media/user-designs/" .$PDFname, 'wb');//creates new file
        // // echo $file;
        // fwrite($file, $data);
        // fclose($file);
    // }
?>