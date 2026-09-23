Get-Content -Path .\index.html | Select-String -Pattern 'window\.MAK_BA_AFTER' | ForEach-Object { "$($_.LineNumber): $($_.Line.Substring(0, [Math]::Min(100, $_.Line.Length)))" }
