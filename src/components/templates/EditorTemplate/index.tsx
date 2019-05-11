import React, { Fragment } from 'react'
import * as H from 'history'
import Header from '../../molecules/Header'
import MarkdownEditor from '../../organisms/MarkdownEditor'
import { ReduxAPIStruct } from '../../../common/static-types/api-struct'

interface Props {
  currentUser: firebase.User
  directoryId: string
  branchId: string
  branchType: 'master' | 'normal'
  latestCommitBody: ReduxAPIStruct<string>
  history: H.History
}

const EditorTemplate: React.FC<Props> = ({ history, ...rest }) => (
  <Fragment>
    <Header colorType="whiteBase" pageType="edit" history={history} />
    <MarkdownEditor {...rest} />
  </Fragment>
)

export default EditorTemplate
