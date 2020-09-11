# Firefox proxy auto-config (PAC)

I'm exploring this because I would like to have a browser that can search Google while accessing resources only available behind the Controls firewall at Fermilab.

My first Googlel search led me to [StackOverflow](https://superuser.com/questions/929861/how-to-enable-a-proxy-in-firefox-only-for-some-urls-and-not-for-every-page-i-vis) and consequently to [MozillaZine](http://forums.mozillazine.org/viewtopic.php?f=38&t=281605) and [WikiPedia](https://en.wikipedia.org/wiki/Proxy_auto-config).

These references and example were enough to get me started and I took the opportunity to refactor it and make it more flexible.

## Example

```javascript
function FindProxyForURL(url, host) {
  host = host.toLowerCase();
  if (dnsDomainIs(host, "blocked.com") ||
      dnsDomainIs(host, "censored.stuff.com"))
    return "PROXY 123.45.67.89:80"; // (IP:port)

  return "DIRECT";
}
```

## Refactor

```javascript
function FindProxyForURL(url, host) {
    const proxyList = [`fnal.gov`]
    const shouldProxyHost = domain => {
        return dnsDomainIs(host.toLowerCase(), domain)
    }

    if (proxyList.some(shouldProxyHost))
        return `SOCKS5 localhost:1080`

    return `DIRECT`
}
```

## Enable proxy

There must be a proxy at `localhost:1080` for this to work.

```bash
ssh -D 1080 basion_host
```

The above command will proxy requests to `localhost:1080` through to `bastion_host`.

Run this in a terminal to enable requests behind the firewall.
