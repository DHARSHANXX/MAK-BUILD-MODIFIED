$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/index.html' -UseBasicParsing
$liveHtml = $res.Content
$idx = $liveHtml.IndexOf('<footer')
$end = $liveHtml.IndexOf('</footer>') + 9
if ($idx -ne -1 -and $end -ne -1) {
    Write-Output $liveHtml.Substring($idx, $end - $idx)
} else {
    Write-Output "Footer not found"
}
