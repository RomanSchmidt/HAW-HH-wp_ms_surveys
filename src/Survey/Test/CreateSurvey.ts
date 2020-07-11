import * as should from "should";
import AObject from "../../Core/AObject";
import Service from "../Service";
import {ErrorType} from "../../Core/Error/ErrorType";
import Model from "../Model";

export class CreateSurvey extends AObject {

    constructor() {
        super();
        describe("create Survey", () => {
            this._before();
            this._run();
        });
    }

    private _before(): void {
        before(async () => {
            const model = new Model();
            await model.init();
            //console.log('model.getDb()', model.getDb());
            await model.getDb()?.deleteMany({});
        });
    }

    private _run(): void {
        it('should not save with empty payload', async () => {
            try {
                await new Service().create({});
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    title: ErrorType.empty,
                    questions: ErrorType.empty
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty questions #1', async () => {
            try {
                await new Service().create({
                    title: "survey1"
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({questions: ErrorType.empty});
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty question #2', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: []
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({questions: ErrorType.empty});
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save without title in question', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.title': ErrorType.empty,
                    'questions.0.answers': ErrorType.empty,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid title in question', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 1}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.title': ErrorType.invalid,
                    'questions.0.answers': ErrorType.empty,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid title in question', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 1}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.title': ErrorType.invalid,
                    'questions.0.answers': ErrorType.empty,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty answers #1', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 'A or B'}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.answers': ErrorType.empty,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty answers #2', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 'A or B', answers: []}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.answers': ErrorType.empty,
                    'questions.0': ErrorType.invalid,
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save without title in answer', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 'A or B', answers: [{}]}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.answers.0.title': ErrorType.empty,
                    'questions.0.answers.0': ErrorType.invalid,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid title in answer', async () => {
            try {
                await new Service().create({
                    title: 'survey1',
                    questions: [{title: 'A or B', answers: [{title: 1}]}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'questions.0.answers.0.title': ErrorType.invalid,
                    'questions.0.answers.0': ErrorType.invalid,
                    'questions.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should create a survey', async () => {
            const
                payload = {
                    title: 'survey1',
                    questions: [{title: 'A or B', answers: [{title: 'a'}, {title: 'b'}]}]
                },
                survey = await new Service().create(payload)
            ;

            survey.should.be.an.Object();
            survey.should.have.property('title', payload.title);
            survey.should.have.property('userCounter', 0);
            survey.should.have.property('questions').which.is.an.Array().with.lengthOf(1);
            survey.questions[0].should.have.property('title', payload.questions[0].title);
            survey.questions[0].should.have.property('answers').which.is.an.Array().with.lengthOf(2);
            survey.questions[0].answers[0].should.be.an.Object();
            survey.questions[0].answers[0].should.have.property('title', payload.questions[0].answers[0].title);
            survey.questions[0].answers[1].should.be.an.Object();
            survey.questions[0].answers[1].should.have.property('title', payload.questions[0].answers[1].title);
        });
    }
}

new CreateSurvey();