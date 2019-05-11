import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import * as H from 'history'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons'
import { mergeBranch, closeBranch } from '../../../../actions/branches'

interface Props {
  currentUserUid: string
  directoryId: string
  branchId: string
  branchName: string
  history: H.History
}

interface DispatchProps {
  mergeBranch: (currentUserUid: string, directoryId: string, branchId: string) => void
  closeBranch: (currentUserUid: string, directoryId: string, branchId: string) => void
}

const BranchListItem: React.FC<Props & DispatchProps> = ({
  currentUserUid,
  branchName,
  history,
  directoryId,
  branchId,
  mergeBranch,
  closeBranch,
}) => (
  <Fragment>
    <ListItem button component="a" href={`${directoryId}/${branchId}/edit`}>
      <ListItemIcon>
        <FontAwesomeIcon icon={faCodeBranch} />
      </ListItemIcon>
      <ListItemText primary={branchName} />
    </ListItem>
    {branchName !== 'master' && (
      <Fragment>
        <button onClick={() => mergeBranch(currentUserUid, directoryId, branchId)}>
          merge to master
        </button>
        <button onClick={() => history.push(`/${branchName}/diff`)}>check diff</button>
        <button onClick={() => closeBranch(currentUserUid, directoryId, branchId)}>
          close blanch
        </button>
      </Fragment>
    )}
  </Fragment>
)

export default connect(
  null,
  { mergeBranch, closeBranch }
)(BranchListItem)
