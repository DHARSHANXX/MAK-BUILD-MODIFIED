$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/index.html' -UseBasicParsing
$html = $res.Content
$idx = $html.IndexOf('setBaPosition(0)')
if ($idx -ge 0) {
    Write-Host $html.Substring($idx - 50, 600)
}
