// Real binary MinHeap with custom comparator.
// Default compares numeric `priority` field, falls back to `<` on primitives.
export default class MinHeap {
  constructor(compare) {
    this.heap = [];
    this.compare =
      compare ||
      ((a, b) => {
        const pa = typeof a === "object" ? a.priority ?? a.cost ?? 0 : a;
        const pb = typeof b === "object" ? b.priority ?? b.cost ?? 0 : b;
        return pa - pb;
      });
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0];
  }

  push(item) {
    this.heap.push(item);
    this.#bubbleUp(this.heap.length - 1);
    return this;
  }

  // Backwards-compat alias for the old API
  insert(item) {
    return this.push(item);
  }

  pop() {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.#bubbleDown(0);
    }
    return top;
  }

  // Backwards-compat alias for the old API
  extractMin() {
    return this.pop();
  }

  #bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.heap[i], this.heap[parent]) < 0) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }

  #bubbleDown(i) {
    const n = this.heap.length;
    for (;;) {
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      let smallest = i;
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}
