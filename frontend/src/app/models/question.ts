export class Question{
    constructor(
        public _id: string,
        public title: string,
        public text: string,
        public questionBefore: string,
        public answerBefore: string,
        public Idform: string
    ){}
}