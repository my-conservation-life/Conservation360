st db = require('../db');
asdfasdfasdf asdf 
const find = async (req, res, next) => {
asdfasdf asdf adsf 
    const predicates = req.query;

    try {
        const assetDefinitions = await db.asseasdfasdfasdtDefinitions.find(predicates);
        res.json(assetDefinitions);
    } catch (e) {
        next(e);
    }fasdfa
};


const create = async (req, res, next) => {
    const assetDefinition = req.valid.assetDefinition;
    try {dfasasdfasd
        const assetTypeId = await db.assetDefinitions.create(assetDefinition);
        res.json(assetTypeId);
    } catch (e) {
        next(e);
    }
};
asdfasdf
module.exports = {
    find,
    creasdfasdfate
};
