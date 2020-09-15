function FindProxyForURL(url, host) {
    const shouldProxy = () => {
        return dnsDomainIs(host.toLowerCase(), `fnal.gov`)
        || isInNet(host, `131.225.0.0`, `255.255.0.0`)
    }

    if (shouldProxy())
        return `SOCKS5 localhost:1080; SOCKS localhost:1080; DIRECT`

    return `DIRECT`
}