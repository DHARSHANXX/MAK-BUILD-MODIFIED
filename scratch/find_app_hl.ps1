Get-Content -Path .\app.js | Select-String -Pattern 'highlight' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
