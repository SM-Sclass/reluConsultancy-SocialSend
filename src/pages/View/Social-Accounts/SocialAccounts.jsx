import React, { useState } from 'react'
import PlatformTable from './Social-accounts-table'
import Breadcrumb from '../../../components/BreadCrumb'
import AddSocialAccountPopup from './AddSocialAccountPopUp'
import UserSettingsModal from './UserSettingModal'

const SocialAccounts = () => {
  const [showPopUp, setShowPopUp] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className='w-full'>
      <Breadcrumb onClickFunction={() => { setShowPopUp(true) }} pageName="Social Accounts" availableEntries="67" />
      <PlatformTable buttonFunction={(username) => setSelectedUser(username)}
        selectedUser={selectedUser} />
      {/* Show Popup */}
      {showPopUp && (
        <AddSocialAccountPopup onClose={() => setShowPopUp(false)} />
      )}
      <UserSettingsModal
        username={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

export default SocialAccounts