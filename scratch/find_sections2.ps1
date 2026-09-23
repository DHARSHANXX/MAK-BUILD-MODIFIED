Get-Content -Path .\index.html | Select-String -Pattern 'id="' | Select-Object -Skip 35 -First 40 | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
