Get-Content -Path .\index.html | Select-String -Pattern 'ba-img-after' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
