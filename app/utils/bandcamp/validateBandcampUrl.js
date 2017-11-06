import validUrl from 'valid-url'

const INVALID_URL = 'Invalid URL'
const NOT_A_BANDCAMP_URL = 'Not a Bandcamp URL'

export default function validateBandcampUrl(url) {
  return new Promise((resolve, reject) => {

    // Check url validity in general
    if (!validUrl.isWebUri(url)) {
      reject(INVALID_URL)
    }

    // Check that the url is from Bandcamp
    if (!url.includes('bandcamp.com')) {
      reject(NOT_A_BANDCAMP_URL)
    }

    resolve()

  })
}
