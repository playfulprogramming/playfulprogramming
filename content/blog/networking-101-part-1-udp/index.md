---
{
	title: "Networking 101: UDP",
	description: 'An introduction to the User Data Protocol, the simplest method of communicating over a network',
	published: '2019-09-26T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['udp', 'networking'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

# UDP {#udp}

UDP is the **"User Datagram Protocol"**. Of the acronym, you may be familiar with "User" and "Protocol", but the term **"datagram"** may be new. 

If you're familiar with how a telegram (like the old-school messaging method, not the new-age messaging platform) used to work, you may already be familiar with how a datagram works.

_A datagram is a uni-directional, non-verifably-sent peice of communication that contains data._

Whoa. What's that even mean?

Okay, let's take a step back and understand what's going on with a datagram. Let's imagine you want to send a letter with some information to a friend in another state. Using the postal service, you're unable to verify that your friend has recieved the letter, only wait for a reply. There's also interaction required in order to send a letter. So long as you know the address of your friend, you can send as many letters as you'd like.

In a typical correspondance, you'd send off a letter, include a return address, and wait for a response back. That said, there's nothing stopping someone from sending more than a single letter before recieving a response. This is a good example of that.

![An image showcasing the rules of data sending both ways](./image-of-unidirectional-data-being-sent.svg)

Similarly, a datagram is sent from a single sender, recieved by a single recipient, addressed where to go, and contains a set of information.

However, one of the biggest weakness of a datagram is that you have no guarantee that what you sent was delivered. Because of this, other methods of sending data have been created in order to have assurance of data being received.

That said, just because you're unsure whether or not it was sent does not mean that it's a useless delivery method. After all, we still utilize the postal service for various aspects of foundational infrastructure, despite similar flaws.

## IP Addresses and Packets {#ip-addresses-and-packets}

_With a datagram, you send a group of data to another client that you know the address of_. This address is known as an **"IP Address"**. This address is composed of number and sometimes letters _in order to tell your computer where the other is_.

![An image showing a "letter" going to an IPv4 address of 149.32.206.25 in a collection of machines with different IP addresses](./showing-an-ip-address.svg)

The group of data that is sent using a datagram is known as a **"packet"**. This packet contains both a header and a body

![A breakdown of a packet showing a combination of a header with metadata and a body with data for the client](./breakdown-of-a-packet.svg)

These headers can contain information like what size the content is, what type of data format the body of the packet contains, and more. This information can be then used to route specific packets to various routes. For example, say that I send a packet of data to a server that has the type 

`video: title: "A simulation of a packet that has a header stating the body to be in XML format being routed to a server that specifically handles XML files and a packet with a header that notes the data being in JSON being routed to a server that handles JSON": ./redirect-based-on-headers.mp4`





 

## Ports {#udp-ports}

Just like an apartment complex can have a single mailbox for multiple people living within the same building, so too can a machine have multiple landing 

