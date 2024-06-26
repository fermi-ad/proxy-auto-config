// eslint-disable-next-line no-unused-vars
function FindProxyForURL(url, host) {
    function shouldProxy() {
        return dnsDomainIs(host.toLowerCase(), 'fnal.gov')
        || dnsDomainIs(host.toLowerCase(), 'fermilab.atlassian.net')
        || isInNet(host, '131.225.0.0', '255.255.0.0') 
        || isInNet(host, '10.200.0.0', '255.255.0.0');
    }

    if (shouldProxy()) {
        return 'SOCKS5 localhost:1080; SOCKS localhost:1080; DIRECT';
    }

    return 'DIRECT';
}
