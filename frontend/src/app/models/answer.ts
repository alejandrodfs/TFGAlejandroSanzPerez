export class Answer{
   constructor(
    public _id: string,
    public text: string, 
    public numselect: number,
    public finalQuestion: boolean,
    public Idquestion: string
   ){}
}