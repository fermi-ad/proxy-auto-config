# Firefox proxy auto-config (PAC)

I explored this because I wanted have a browser that can search Google while accessing resources only available behind a firewall.

My first Googlel search led me to [StackOverflow](https://superuser.com/questions/929861/how-to-enable-a-proxy-in-firefox-only-for-some-urls-and-not-for-every-page-i-vis) and consequently to [MozillaZine](http://forums.mozillazine.org/viewtopic.php?f=38&t=281605) and [WikiPedia](https://en.wikipedia.org/wiki/Proxy_auto-config).

These references and example were enough to get me started and I took the opportunity to refactor it and make it more flexible.

Originally, I was using Firefox's manual proxy to get behind the firewall, but the method sends all traffic to the proxy with a list of exceptions. I want the other way around. I want only certain request to go behind the firewall. Proxy auto-config allows custom code to route traffic and solves my problem.

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
        || isInNet(host, `131.225.0.0`, `255.255.0.0`)
    }

    if (proxyList.some(shouldProxyHost))
        return `SOCKS5 localhost:1080; SOCKS localhost:1080; DIRECT`

    return `DIRECT`
}
```

## Enable proxy

There must be a proxy at `localhost:1080` for pages within the firewall to work.

```bash
ssh -D 1080 basion_host
```

The above command will proxy requests to `localhost:1080` through to `bastion_host`.

Run this in a terminal to enable requests behind the firewall.

## Install proxy.pac

While an OS wide proxy could be useful I found it difficult to troubleshoot and wasn't able to make it work on my MacBook Pro. There are recomendations from around the web to "just use the browser."

### Firefox

In the Firefox settings `about:preferences#general`>Network Settings there is a field for `Automatic proxy configuration URL` where you can link to an external URL or a local file using `file://`.

The file must be named `proxy.pac`.

### Chromium

The Chromium team recommends using an extension to enable a proxy on Chromium browsers. I found the [Proxy Switcher extension](https://mybrowseraddon.com/proxy-switcher.html) to be well liked and simple.

This also works with Firefox.

### Safari

TODO
