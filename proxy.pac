function FindProxyForURL(url, host) {
    const proxyList = [`fnal.gov`]

    if (proxyList.some(domain => dnsDomainIs(host, domain)))
        return `SOCKS5 localhost:1080`

    return `DIRECT`
}