import * as should from "should";
import AObject from "../../Core/AObject";
import Model from "../Model";
import Service from "../Service";
import {ErrorType} from "../../Core/Error/ErrorType";
import Survey from "../Foreign/Survey";
import {Types} from "mongoose";

export class CreateOpinion extends AObject {
    private _survey: { _id: Types.ObjectId, questions: [{ _id: Types.ObjectId, answers: [{ _id: Types.ObjectId }] }] } = <any>{};

    constructor() {
        super();
        describe("create opinion", () => {
            this._before();
            this._run();
        });
    }

    private _before(): void {
        before(async () => {
            const model = new Model();
            await model.init();
            await model.getDb()?.deleteMany({});
        });
    }

    private _run(): void {
        it('should create survey', async () => {
            this._survey = <any>await new Survey().post.create({
                title: 'foo',
                questions: [{title: 'A or B', answers: [{'title': 'A'}, {'title': 'B'}]}]
            });
        })

        it('should not save with empty payload', async () => {
            try {
                await new Service().create({});
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.have.properties({surveyId: ErrorType.empty, response: ErrorType.empty});
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty response #1', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({response: ErrorType.empty});
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty response #2', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: []
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({response: ErrorType.empty});
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save without questionId and answerIds', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: [{}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'response.0.questionId': ErrorType.empty,
                    'response.0.answerIds': ErrorType.empty
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid questionId and answerIds', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: [{questionId: 'asdf', answerIds: 'adf'}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'response.0.questionId': ErrorType.invalid,
                    'response.0.answerIds': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with empty answerIds', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: [{questionId: this._survey.questions[0]._id, answerIds: []}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'response.0.answerIds': ErrorType.empty
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid answerIds element #1', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: [{questionId: this._survey.questions[0]._id, answerIds: [{}]}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'response.0.answerIds.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should not save with invalid answerIds element #2', async () => {
            try {
                await new Service().create({
                    surveyId: this._survey._id,
                    response: [{questionId: this._survey.questions[0]._id, answerIds: ["adsf"]}]
                });
            } catch (e) {
                should(e).be.an.Object();
                should(e).have.property('message').which.is.an.String();
                const message = JSON.parse(e.message);
                message.should.be.an.Object();
                message.should.be.eql({
                    'response.0.answerIds.0': ErrorType.invalid
                });
                return;
            }
            false.should.be.true('no exception');
        });

        it('should make sure userCounter is at 0', async () => {
            const survey = await new Survey().get.byId<{ userCounter: number }>(this._survey._id);
            survey.should.be.an.Object();
            survey.should.have.property('userCounter', 0);
        });

        it('should create an opinion', async () => {
            const
                payload = {
                    surveyId: this._survey._id,
                    response: [{
                        questionId: this._survey.questions[0]._id,
                        answerIds: [this._survey.questions[0].answers[0]._id]
                    }]
                },
                opinion = await new Service().create(payload)
            ;

            opinion.should.be.an.Object();
            opinion.should.have.property('surveyId');
            opinion.surveyId.toString().should.be.eql(payload.surveyId.toString());
            opinion.should.have.property('response').which.is.an.Array().with.lengthOf(1);
            opinion.response[0].should.have.property('answerIds').which.is.an.Array().with.lengthOf(1);
            opinion.response[0].answerIds[0].toString().should.be.eql(payload.response[0].answerIds[0]);
        });


        it('should make sure userCounter is at 1', async () => {
            const survey = await new Survey().get.byId<{ userCounter: number }>(this._survey._id);
            survey.should.be.an.Object();
            survey.should.have.property('userCounter', 1);
        });
    }
}

new CreateOpinion();