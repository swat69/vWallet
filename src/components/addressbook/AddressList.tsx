import * as React from 'react'
import ProfileListItem from './ProfileListItem'
import { inject, observer } from 'mobx-react'
import { ContactStore } from '../../stores/addressbook/ContactStore'
import ProfileDetails from './ProfileDetails'
import IContact from '../../stores/addressbook/IContact'
import Contact from '../../stores/addressbook/Contact'

class AddressList extends React.Component<{ ContactStore?: ContactStore }> {
  state: {
    selection: IContact | null
    editing: boolean
  } = { selection: null, editing: false }

  toggleContact(id: string) {
    return () => {
      this.setState({
        selection: this.props.ContactStore!.getContactById(id),
        editing: false,
      })
    }
  }

  isContactSelection(contact: IContact) {
    if (this.state.selection) {
      return contact.id === this.state.selection.id
    }

    return false
  }

  addNewContact() {
    const newContact: IContact = new Contact('', '')
    this.props.ContactStore!.addContact(newContact)
    this.toggleContact(newContact.id)()
    this.setState({ editing: true })
  }

  render() {
    console.log(this.props.ContactStore)
    return (
      <div className="addressbook">
        <div className="row header">
          <div className="col-md-3 divider">
            <span>Contacts</span>{' '}
            <div className="add-button" onClick={this.addNewContact.bind(this)}>
              +
            </div>
          </div>
          <div className="col-md-9 details-view">
            <button
              disabled={this.state.selection == null}
              onClick={() => {
                this.setState({ editing: !this.state.editing })
              }}
              className="left-edit"
            >
              {this.state.editing ? 'Save' : 'Edit'}
            </button>
            <button
              disabled={this.state.selection == null}
              onClick={() => {
                if (this.state.selection) {
                  this.props.ContactStore!.removeContact(this.state.selection)
                  this.setState({ selection: null })
                }
              }}
              className="left-edit"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 divider divider-bottom">
            <input
              className="search-input"
              type="text"
              placeholder="Search Contact..."
            />
          </div>
        </div>
        <div className="row ">
          <div className="col-md-3 divider profile-list">
            {this.props.ContactStore!.allContacts.map(contact => (
              <ProfileListItem
                contact={contact}
                toggle={this.toggleContact.bind(this)}
                key={contact.id}
                selection={this.isContactSelection(contact)}
              />
            ))}
          </div>
          {this.state.selection ? (
            <div className="col-md-9">
              <ProfileDetails
                editing={this.state.editing}
                contact={this.state.selection}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default inject('ContactStore')(observer(AddressList))