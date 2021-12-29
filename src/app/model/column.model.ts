import { Issue } from "./issue.model";

export class Column {
    constructor(public name: string, public id: string, public tasks: Issue[]) { }
}
