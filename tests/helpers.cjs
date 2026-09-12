'use strict';
async function settleFeedback(page) {
  if (await page.locator('#feedback-view').isVisible()) await page.locator('#feedback-continue').click();
}
module.exports = { settleFeedback };
