class PriorityQueue {
  constructor() {
    this.tasks = [];
  }

  enqueue(task) {
    this.tasks.push(task);
    this.tasks.sort(
      (a, b) =>
        a.priority.localeCompare(b.priority) ||
        new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  dequeue() {
    return this.tasks.shift();
  }

  getTasks() {
    return this.tasks;
  }
}

module.exports = new PriorityQueue();
