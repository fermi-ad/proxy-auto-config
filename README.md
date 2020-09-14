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
    }

    if (proxyList.some(shouldProxyHost))
        return `SOCKS5 localhost:1080; DIRECT`

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

## Install proxy.pac

Firefox enables users to proxy only the traffic from the browser rather than the whole system. Other browser use the OS proxy configuration to proxy traffic.

### Firefox

In the Firefox settings `about:preferences#general`>Network Settings there is a field for `Automatic proxy configuration URL` where you can link to an external URL or a local file using `file://`.

The file must be named `proxy.pac`.

### OS wide proxy

The problem with a system wide proxy is that if the proxy is broken then redirections to that proxy fail. This is why I prefer to limit this redirection to Firefox.

#### Mac OS

[https://support.apple.com/guide/mac-help/enter-proxy-server-settings-on-mac-mchlp2591/mac](https://support.apple.com/guide/mac-help/enter-proxy-server-settings-on-mac-mchlp2591/mac)

#### Linux

This is for Ubuntu. You should search for your ditribution's instructions.

[https://askubuntu.com/questions/912351/how-to-configure-to-auto-detect-proxy](https://askubuntu.com/questions/912351/how-to-configure-to-auto-detect-proxy)

#### Windows

[https://www.dummies.com/computers/operating-systems/windows-10/how-to-set-up-a-proxy-in-windows-10/](https://www.dummies.com/computers/operating-systems/windows-10/how-to-set-up-a-proxy-in-windows-10/)
