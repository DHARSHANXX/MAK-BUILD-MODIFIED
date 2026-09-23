Get-Content -Path .\index.html | Select-String -Pattern 'id="' | Select-Object -First 40 | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
