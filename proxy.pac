function FindProxyForURL(url, host) {
    const proxyList = [`fnal.gov`]
    const shouldProxyHost = domain => {
        return dnsDomainIs(host.toLowerCase(), domain)
    }

    if (proxyList.some(shouldProxyHost))
        return `SOCKS5 localhost:1080; DIRECT`

    return `DIRECT`
}