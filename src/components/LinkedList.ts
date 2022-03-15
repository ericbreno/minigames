export class Node<T> {
  next: Node<T> | null
  prev: Node<T> | null

  constructor(public data: T) {}
}

export class LinkedList<T> {
  private head: Node<T> | null
  private tail: Node<T> | null
  public length = 0

  push(data: T) {
    const node = new Node(data)
    if (!this.head) {
      this.head = node
      this.tail = node
    } else {
      this.tail.next = node
      node.prev = this.tail
      this.tail = node
    }

    this.length++
  }

  pop() {
    if (!this.head) return null

    const node = this.tail
    this.tail = node.prev
    if (this.tail) {
      this.tail.next = null
    } else {
      this.head = null
    }

    this.length--
    return node.data
  }

  shift() {
    if (!this.head) return null

    const node = this.head
    this.head = node.next
    if (this.head) {
      this.head.prev = null
    } else {
      this.tail = null
    }

    this.length--
    return node.data
  }

  peek() {
    return this.tail?.data ?? null
  }

  peekHead() {
    return this.head?.data ?? null
  }
}