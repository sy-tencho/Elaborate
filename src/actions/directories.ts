import { db, FirebaseSnapShot } from '../utils/firebase'
import { ThunkDispatch } from 'redux-thunk'
import { actionTypes } from '../common/constants/action-types'
import { BaseAction, FirebaseAPIRequest, FirebaseAPIFailure } from '../common/static-types/actions'
import { Values } from '../components/molecules/Forms/DirectoryForm'

// -------------------------------------------------------------------------
// Directories
// -------------------------------------------------------------------------
const directoryFirebaseFailure = (message: string) => ({
  type: actionTypes.DIRECTORY__FIREBASE_REQUEST_FAILURE,
  payload: { statusCode: 500, message },
})

interface SetDirectoriesAction extends BaseAction {
  type: string
  payload: { directories: FirebaseSnapShot[] }
}

interface AddDirectoryAction extends BaseAction {
  type: string
  payload: { newDir: FirebaseSnapShot }
}

export type DirectoriesAction =
  | FirebaseAPIRequest
  | FirebaseAPIFailure
  | SetDirectoriesAction
  | AddDirectoryAction

// NOTE: Firebaseはクライアント側のネットワーク不良などでデータのfetchに失敗してもerrorを吐かず、
//       空配列を返してくる... :anger_jenkins:
export const fetchDirectories = (currentUserUid: string | null) => {
  // TODO: Dispatchの型付け
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    if (currentUserUid) {
      dispatch({ type: actionTypes.DIRECTORY__FIREBASE_REQUEST, payload: null })
      db.collection('users')
        .doc(currentUserUid)
        .collection('directories')
        .get()
        .then(querySnapshot => {
          // Firebaseのデータは取得時順番がランダムなので作成順にソートする
          const orderedDocs = querySnapshot.docs.sort((doc1, doc2) => {
            return doc1.data().createdAt - doc2.data().createdAt
          })
          dispatch({
            type: actionTypes.DIRECTORY__SET,
            payload: { directories: orderedDocs },
          })
        })
        .catch(error => dispatch(directoryFirebaseFailure(error.message)))
    }
  }
}

export const createDirectory = (values: Values, currentUserUid: string) => {
  // TODO: Dispatchの型付け
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({ type: actionTypes.DIRECTORY__FIREBASE_REQUEST, payload: null })
    db.collection('users')
      .doc(currentUserUid)
      .collection('directories')
      .add({
        name: values.directoryName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .then(newDirectoryDoc => {
        // newDirectoryをstoreへ保存
        newDirectoryDoc
          .get()
          .then(snapShot => {
            dispatch({
              type: actionTypes.DIRECTORY__ADD,
              payload: { newDir: snapShot },
            })
          })
          .catch(error => dispatch(directoryFirebaseFailure(error.message)))
        // newDirectory配下にmaster branchを追加
        newDirectoryDoc
          .collection('branches')
          .add({
            name: 'master',
            state: 'open',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .then(newBranchDoc => {
            newBranchDoc.collection('commits').add({
              name: 'initial commit',
              body: '',
              createdAt: Date.now(),
            })
          })
          .catch(error => dispatch(directoryFirebaseFailure(error.message)))
      })
      .catch(error => dispatch(directoryFirebaseFailure(error.message)))
  }
}

// -------------------------------------------------------------------------
// IsInvalidDirectory
// -------------------------------------------------------------------------
const isValidDirectoryFirebaseFailure = (message: string) => ({
  type: actionTypes.DIRECTORY_IS_VALID__FIREBASE_REQUEST_FAILURE,
  payload: { statusCode: 500, message },
})

interface CheckDirectoryIdAction extends BaseAction {
  type: string
  payload: { isValidDirectoryId: boolean }
}

export type IsInvalidDirectoryAction =
  | FirebaseAPIRequest
  | FirebaseAPIFailure
  | CheckDirectoryIdAction

export const checkDirectoryId = (currentUserUid: string, directoryId: string) => {
  // TODO: Dispatchの型付け
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({ type: actionTypes.DIRECTORY_IS_VALID__FIREBASE_REQUEST, payload: null })
    const directoryDocRef = db
      .collection('users')
      .doc(currentUserUid)
      .collection('directories')
      .doc(directoryId)

    directoryDocRef
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch({ type: actionTypes.BRANCH__FIREBASE_REQUEST })
          directoryDocRef
            .collection('branches')
            .get()
            .then(querySnapshot => {
              // Firebaseのデータは取得時順番がランダムなので作成順にソートする
              const orderedDocs = querySnapshot.docs.sort((doc1, doc2) => {
                return doc1.data().createdAt - doc2.data().createdAt
              })

              dispatch({
                type: actionTypes.DIRECTORY__CHECK_ID,
                payload: { isValidDirectoryId: true },
              })
              dispatch({
                type: actionTypes.BRANCH__SET,
                payload: { branches: orderedDocs },
              })
            })
            .catch(error => dispatch(isValidDirectoryFirebaseFailure(error.message)))
        } else {
          dispatch({
            type: actionTypes.DIRECTORY__CHECK_ID,
            payload: { isValidDirectoryId: false },
          })
        }
      })
      .catch(error => dispatch(isValidDirectoryFirebaseFailure(error.message)))
  }
}

// -------------------------------------------------------------------------
// DirectoriesStatus
// -------------------------------------------------------------------------

interface SetSelectedDirectoryAction extends BaseAction {
  type: string
  payload: { selectedDirectoryId: string }
}

export type DirectoriesStatusAction = SetSelectedDirectoryAction

export const setSelectedDirectory = (selectedDirectoryId: string) => {
  // TODO: Dispatchの型付け
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({
      type: actionTypes.DIRECTORY__SET_SELECTED_DIRECTORY_ID,
      payload: { selectedDirectoryId },
    })
  }
}
