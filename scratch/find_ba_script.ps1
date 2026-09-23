Get-ChildItem -Path .\ -Filter "*.ps1" | ForEach-Object {
    $c = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($c -match "verified_ba") {
        Write-Output "$($_.Name)"
    }
}
