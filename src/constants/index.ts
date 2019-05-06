import keyMirror from 'keymirror'

export const actionTypes = keyMirror({
  // Directory
  DIRECTORY__FIREBASE_REQUEST: null,
  DIRECTORY__FIREBASE_REQUEST_FAILURE: null,
  DIRECTORY_IS_INVALID__FIREBASE_REQUEST: null,
  DIRECTORY_IS_INVALID__FIREBASE_REQUEST_FAILURE: null,
  DIRECTORY__SET: null,
  DIRECTORY__ADD: null,
  DIRECTORY__CHECK_ID: null,

  // Branches
  BRANCH__FIREBASE_REQUEST: null,
  BRANCH__FIREBASE_REQUEST_FAILURE: null,
  BRANCH_IS_INVALID__FIREBASE_REQUEST: null,
  BRANCH_IS_INVALID__FIREBASE_REQUEST_FAILURE: null,
  BRANCH__SET: null,
  BRANCH__ADD: null,
  BRANCH__CHECK_ID: null,

  // Commits
  COMMIT__FIREBASE_REQUEST: null,
  COMMIT__FIREBASE_REQUEST_FAILURE: null,
  COMMIT__ADD: null,

  // Modal
  MODAL__AUTHENTICATION_OPEN: null,
  MODAL__AUTHENTICATION_CLOSE: null,
})
