import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { fetchDirectories } from '../../../actions/directories'
import { ReduxAPIStruct } from '../../../common/static-types/api-struct'
import { FirebaseSnapShot } from '../../../utils/firebase'
import CircleProgress from '../../atoms/CircleProgress'
import MyPageTemplate from '../../templates/MyPageTemplate'

interface Props extends RouteComponentProps {
  currentUser: firebase.User | null
  fetchDirectories: (currentUserUid: string | null) => void
}

interface StateProps {
  directories: ReduxAPIStruct<FirebaseSnapShot[]>
  branches: ReduxAPIStruct<FirebaseSnapShot[]>
  selectedDirectoryId: string | null
}

const MyPage: React.FC<Props & StateProps> = ({
  currentUser,
  fetchDirectories,
  directories,
  branches,
  selectedDirectoryId,
  history,
}) => {
  useEffect(() => {
    const currentUserUid = currentUser ? currentUser.uid : null
    fetchDirectories(currentUserUid)
  }, [currentUser])

  if (!currentUser) return <CircleProgress />

  return (
    <MyPageTemplate
      directories={directories}
      branches={branches}
      currentUser={currentUser}
      selectedDirectoryId={selectedDirectoryId}
      history={history}
    />
  )
}

export default connect(
  ({ directories, branches, selectedDirectoryId }: StateProps) => ({
    directories,
    selectedDirectoryId,
    branches,
  }),
  { fetchDirectories }
)(MyPage)
