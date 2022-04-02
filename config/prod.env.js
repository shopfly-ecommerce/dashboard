const { distribution, liveVideo, im } = require('./index')

module.exports = {
	NODE_ENV: '"production"',
	ENV_CONFIG: '"prod"',
  DISTRIBUTION: distribution,
	LIVEVIDEO: liveVideo,
	IM: im
}
