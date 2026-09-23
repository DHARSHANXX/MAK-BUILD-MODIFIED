Get-Content -Path .\index.html | Select-String -Pattern 'floating-whatsapp' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
