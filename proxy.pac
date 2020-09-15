function FindProxyForURL(url, host) {
    const proxyList = [`fnal.gov`]
    const shouldProxyHost = domain => {
        return dnsDomainIs(host.toLowerCase(), domain)
        || isInNet(host, `131.225.0.0`, `255.255.0.0`)
    }

    if (proxyList.some(shouldProxyHost))
        return `SOCKS5 localhost:1080; SOCKS localhost:1080; DIRECT`

    return `DIRECT`
}