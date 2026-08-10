const manualStudyEntryService = require("../services/manualStudyEntry.service");

async function createEntry(req, res, next) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    const entryData = req.body;
    
    const entry = await manualStudyEntryService.createEntry(userId, goalId, entryData);

    return res.status(201).json({
      status: "success",
      message: "Manual study entry created successfully",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function getEntriesForGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    
    const entries = await manualStudyEntryService.getEntriesForGoal(userId, goalId);

    return res.status(200).json({
      status: "success",
      message: "Manual study entries retrieved successfully",
      data: entries,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEntry(req, res, next) {
  try {
    const userId = req.user.id;
    const { goalId, id: entryId } = req.params;
    const entryData = req.body;
    
    const entry = await manualStudyEntryService.updateEntry(userId, goalId, entryId, entryData);

    return res.status(200).json({
      status: "success",
      message: "Manual study entry updated successfully",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEntry(req, res, next) {
  try {
    const userId = req.user.id;
    const { goalId, id: entryId } = req.params;
    
    const result = await manualStudyEntryService.deleteEntry(userId, goalId, entryId);

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEntry,
  getEntriesForGoal,
  updateEntry,
  deleteEntry,
};
