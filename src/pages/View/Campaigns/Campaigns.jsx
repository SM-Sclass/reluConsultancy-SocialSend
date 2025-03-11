import React, { useContext } from 'react'
import Breadcrumb from '../../../components/BreadCrumb'
import CampaignTable from './CampaignTable'
import { CampaignContext } from './CampaignContext'

function Campaigns() {
  const {setCampaignComponent} = useContext(CampaignContext)
  // const [showPopUp, setShowPopUp] = useState(false)

  return (
    <div>
      <Breadcrumb onClickFunction={() => setCampaignComponent("Create")} pageName="Campaigns" availableEntries="54" />
      <CampaignTable />
    </div>
  )
}

export default Campaigns