const Joi = require('joi')

module.exports = {
    validateBody : (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body,schema)
            if (result.error){
                return res.status(400).json(result.error)
            }
            if (!req.value){req.value = {}}
            req.value['body'] = result.value
            next()
        }
    },
    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password : Joi.string().required()
        }),
        activitySchema : Joi.object().keys({
            title: Joi.string().required(),
            progress: Joi.number(),
            targetDate: {
                start: Joi.date(),
                finish: Joi.date()
            },
            actualDate: {
                start: Joi.date(),
                finish: Joi.date()
            },
            //selfConstrain : ,
            dependsOn: Joi.array().items(Joi.object().keys({
                offset: Joi.number(),
                unit: Joi.string(),
                activity: Joi.string().required()
            }))
        }),
        activityUpdateSchema : Joi.object().keys({
            title: Joi.string(),
            progress: Joi.number(),
            targetDate: {
                start: Joi.date(),
                finish: Joi.date()
            },
            actualDate : {
                start: Joi.date(),
                finish: Joi.date()
            }
        }),
        commentSchema : Joi.object().keys({
            creator : Joi.string(),
            content : Joi.string().required()
        }),
        constrainUpdateSchema : Joi.object().keys({
            activity : Joi.string(),
            unit : Joi.string(),
            offset: Joi.number()
        }),
        //activitiesUpdateSchema
        //activitiesSchema : Joi.array
        documentSchema : Joi.object().keys({
            name : Joi.string().required(),
            owner :  Joi.string(),
            description: Joi.string()
        }),
        documentUpdateSchema : Joi.object().keys({
            name : Joi.string(),
            owner :  Joi.string(),
            description: Joi.string()
        })
    }
}