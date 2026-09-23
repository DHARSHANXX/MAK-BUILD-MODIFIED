$fileBytes = [System.IO.File]::ReadAllBytes("assets\penthouse-after-hd.jpg")
$fileBase64 = [Convert]::ToBase64String($fileBytes)
$txtBase64 = Get-Content "assets\ba-after-base64.txt"
Write-Output "File length: $($fileBase64.Length)"
Write-Output "Txt length:  $($txtBase64.Length)"
Write-Output "Match:       $($fileBase64 -eq $txtBase64)"
