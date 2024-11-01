terraform {
  required_providers {
    mgc = {
      source = "magalucloud/mgc"
      version = "0.18.10"
    }
  }
}

provider "mgc" {
  alias = "sudeste"
  region = "br-se1"
}

// virtual_machines.tf
resource "mgc_virtual-machine_instances" "myvm" {
    provider = mgc.sudeste
    name = "covenagoravai"
    machine_type = {
        name = "BV8-32-100"
    }

    image = {
        name = "cloud-ubuntu-22.04 LTS"
    }
    network = {
      associate_public_ip = true
      delete_public_ip = true
      interface = {
      security_groups = [{
         # grupo criado previamente pelo gabriel
        id = "4aa1a237-2d57-439b-bf6a-177ddbace4cb"
      }]
    }
    }
    ssh_key_name = "covensecomp"
}

resource "mgc_block-storage_volumes" "block_storage-sudeste" {
    provider = mgc.sudeste
    name = "storagecovenagoravai"
    size = 100
    type = {
        name = "cloud_nvme20k"
    }
}
