import { Publisher } from 'zeromq'

class Messaging {
  private pub?: Publisher
  private binding?: Promise<void>
  async publish(topic: string, payload: string) {
    if (!this.pub) this.pub = new Publisher()
    if (!this.binding) {
      const url = process.env.ZMQ_PUB_URL || 'tcp://127.0.0.1:5555'
      this.binding = this.pub.bind(url)
    }
    await this.binding
    await this.pub.send([topic, payload])
  }
}

export const messaging = new Messaging()
