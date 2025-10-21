export interface Task {
  id: string;

  title: string;
  description: string;

  status: Status;
  priority: Priority;

  projectId: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
