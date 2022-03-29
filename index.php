<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

$router->post("/upload/file", function () {
    $base64_string = request()->document;
    $data_image = explode(',', $base64_string);
    $image = $data_image[1];
    $file_name = str_replace('data:', '', explode(';base64', $data_image[0])[0]);
    $file_path = 'files/' . Str::uuid() . $file_name;
    Storage::disk("public")->put($file_path, base64_decode($image));
    return response()->json([
        "message" => 'Arquivo: ' . $file_name . ' salvo com sucesso.'
    ]);
});