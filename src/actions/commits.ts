import { db, FirebaseSnapShot } from '../utils/firebase'
import { ThunkDispatch } from 'redux-thunk'
import { RawDraftContentBlock } from 'draft-js'
import { convertToText } from '../common/functions'
import { actionTypes } from '../common/constants/action-types'
import { BaseAction, FirebaseAPIRequest, FirebaseAPIFailure } from '../common/static-types/actions'
import { ReduxAPIStruct } from '../common/static-types/api-struct'
import { Values } from '../components/molecules/Forms/CommitForm'

// -------------------------------------------------------------------------
// Commits
// ------------------------------------------------------------------------
const commitFirebaseFailure = (message: string) => ({
  type: actionTypes.COMMIT__FIREBASE_REQUEST_FAILURE,
  payload: { statusCode: 500, message },
})

interface CreateCommitAction extends BaseAction {
  type: string
  payload: { newCommit: ReduxAPIStruct<FirebaseSnapShot> }
}

export type CommitsAction = FirebaseAPIRequest | FirebaseAPIFailure | CreateCommitAction

export const createCommit = (
  values: Values,
  currentUserUid: string,
  directoryId: string,
  branchId: string,
  rawContentBlocks: RawDraftContentBlock[]
) => {
  return async (dispatch: ThunkDispatch<{}, {}, CommitsAction>) => {
    const commitText = convertToText(rawContentBlocks)
    dispatch({ type: actionTypes.COMMIT__FIREBASE_REQUEST })
    db.collection('users')
      .doc(currentUserUid)
      .collection('directories')
      .doc(directoryId)
      .collection('branches')
      .doc(branchId)
      .collection('commits')
      .add({
        name: values.commitName,
        body: commitText,
        cratedAt: Date.now(),
      })
      .then(newDocRef => {
        newDocRef.get().then(snapShot => {
          dispatch({
            type: actionTypes.COMMIT__ADD,
            payload: { newCommit: snapShot },
          })
        })
      })
      .catch(error => dispatch(commitFirebaseFailure(error.message)))
  }
}

// -------------------------------------------------------------------------
// latestCommitBody
// -------------------------------------------------------------------------
const latestCommitBodyFirebaseFailure = (message: string) => ({
  type: actionTypes.LATEST_COMMIT_BODY__FIREBASE_REQUEST_FAILURE,
  payload: { statusCode: 500, message },
})

export type LatestCommitBodyAction = FirebaseAPIRequest | FirebaseAPIFailure

export const fetchLatestCommitBody = (
  currentUserUid: string,
  directoryId: string,
  branchId: string
) => {
  return async (dispatch: ThunkDispatch<{}, {}, LatestCommitBodyAction>) => {
    dispatch({ type: actionTypes.LATEST_COMMIT_BODY__FIREBASE_REQUEST })
    db.collection('users')
      .doc(currentUserUid)
      .collection('directories')
      .doc(directoryId)
      .collection('branches')
      .doc(branchId)
      .collection('commits')
      .get()
      .then(querySnapshot => {
        // Firebaseのデータは取得時順番がランダムなので作成が遅い順にソートする
        // NOTE: 他のソートとは順番が逆なので注意
        const orderedCommits = querySnapshot.docs.sort((doc1, doc2) => {
          return doc2.data().createdAt - doc1.data().createdAt
        })

        const latestCommitBody = orderedCommits[0].data().body
        const bodyShouldDisplayOnEditor = latestCommitBody !== undefined ? latestCommitBody : ''

        dispatch({
          type: actionTypes.LATEST_COMMIT_BODY__SET,
          payload: bodyShouldDisplayOnEditor,
        })
      })
      .catch(error => latestCommitBodyFirebaseFailure(error.message))
  }
}
